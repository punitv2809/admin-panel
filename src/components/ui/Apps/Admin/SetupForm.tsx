"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import {
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { RefreshCcw, Terminal } from "lucide-react"
import { useAdminAppStore } from "../../stores/admin.app.store"
import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "../../alert"

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    host: z.string().min(1, "Host is required").endsWith("/", "Host must end with '/'"),
    usernameOrEmail: z.string().min(1, "Username or email is required"),
    password: z.string().min(1, "Password is required"),
    pingPath: z
        .string()
        .min(1, "Ping path is required")
        .startsWith("/", "Ping path must start with '/'"),
    inUse: z.boolean().optional(),
    authorization: z.string().optional(),
})

type SetupFormProps = {
    defaultValues?: Partial<z.infer<typeof formSchema>>
    onClose?: () => void
    editIndex?: number | null
}

type LoginResponse = {
    success: boolean
    message: string
    data: {
        token: string
    }
}

type ConnectionLoading = {
    authorization: boolean,
    authorizationError: boolean,
    authorizationErrorMessage: string,
    ping: boolean,
    pingError: boolean,
    pingErrorMessage: string
}

type ConnectionResult = {
    success: boolean
    data?: LoginResponse
    error?: {
        status: number
        message: string
        details?: any
    }
}

export default function SetupForm({ defaultValues, onClose, editIndex }: SetupFormProps) {
    const [connectionLoading, setConnectionLoading] = useState<ConnectionLoading>({
        authorization: false,
        authorizationError: false,
        authorizationErrorMessage: "",
        ping: false,
        pingError: false,
        pingErrorMessage: ""
    })
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            host: "",
            usernameOrEmail: "",
            password: "",
            pingPath: "",
            inUse: false,
            authorization: "",
            ...defaultValues,
        }
    })

    const addServer = useAdminAppStore((s) => s.addServer)
    const updateServer = useAdminAppStore((s) => s.updateServer)

    async function testConnection(values: z.infer<typeof formSchema>): Promise<ConnectionResult> {
        try {
            const resp = await fetch(`${values.host}rest/v2/user/login`, {
                method: "POST",
                body: JSON.stringify(
                    {
                        username: values.usernameOrEmail,
                        password: values.password
                    }
                ),
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if (resp.ok) {
                const data = await resp.json() as LoginResponse
                return { success: true, data }
            } else {
                let errorDetails = null
                try {
                    errorDetails = await resp.json()
                } catch (e) {
                    // Response body is not JSON
                }

                return {
                    success: false,
                    error: {
                        status: resp.status,
                        message: resp.statusText,
                        details: errorDetails
                    }
                }
            }
        } catch (error) {
            return {
                success: false,
                error: {
                    status: 0,
                    message: 'Network error',
                    details: error
                }
            }
        }
    }
    async function testPing(values: z.infer<typeof formSchema>, token: string): Promise<{ success: boolean, error?: string }> {
        try {
            let pingPath = values.pingPath
            if (pingPath.startsWith('/')) {
                pingPath = pingPath.substring(1)
            }
            const resp = await fetch(`${values.host}${pingPath}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })

            if (resp.ok) {
                return { success: true }
            } else {
                return {
                    success: false,
                    error: `HTTP ${resp.status}: ${resp.statusText}`
                }
            }
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Network error'
            }
        }
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            if (editIndex != null) {
                updateServer(editIndex, values)
            } else {
                const resp = await testConnection(values)
                if (resp.success) {
                    values.authorization = resp.data!.data.token
                    setConnectionLoading({
                        authorization: true,
                        authorizationError: false,
                        authorizationErrorMessage: "",
                        ping: false,
                        pingError: false,
                        pingErrorMessage: ""
                    })
                    const pingResult = await testPing(values, resp.data!.data.token)
                    console.log("Ping result:", pingResult)
                    if (pingResult.success) {
                        setConnectionLoading({
                            authorization: false,
                            authorizationError: false,
                            authorizationErrorMessage: "",
                            ping: true,
                            pingError: pingResult.error ? true : false,
                            pingErrorMessage: pingResult.error || ""
                        })
                    } else {
                        setConnectionLoading({
                            authorization: false,
                            authorizationError: false,
                            authorizationErrorMessage: "",
                            ping: false,
                            pingError: true,
                            pingErrorMessage: "Failed to ping, please check the ping path"
                        })
                    }
                } else {
                    setConnectionLoading({
                        authorization: false,
                        authorizationError: true,
                        authorizationErrorMessage: "Failed to authorize, please check the username and password",
                        ping: false,
                        pingError: false,
                        pingErrorMessage: ""
                    })
                }
            }
            if (editIndex == null) {
                const newValues = {
                    ...values,
                    inUse: values.inUse ?? false,
                    authorization: values.authorization ?? ""
                }
                addServer(newValues)
                toast("Saved successfully")
                onClose?.()
            }
        } catch (error) {
            toast.error("Failed to save")
        }
    }

    return (
        <DialogContent className="">
            <DialogHeader className="">
                <DialogTitle>Configure Backend</DialogTitle>
            </DialogHeader>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Backend Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Production Server" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Optional notes about this backend"
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="host"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Host</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. monocon.local.pompom.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="usernameOrEmail"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username or Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. admin@domain.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Enter password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="pingPath"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ping Path</FormLabel>
                                    <FormControl>
                                        <Input placeholder="/ping" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="inUse"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <FormLabel className="m-0">Set as Active Backend</FormLabel>
                                    <FormControl>
                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>

                    {connectionLoading.authorization && <div className="flex items-center text-sm">
                        <Loader />
                        <p>Testing authorization...</p>
                    </div>}
                    {connectionLoading.authorizationError && <ConnectionAlert message={connectionLoading.authorizationErrorMessage} isError={true} />}
                    {connectionLoading.ping && <div className="flex items-center">
                        <Loader />
                        <p>Testing ping...</p>
                    </div>}
                    {connectionLoading.pingError && <ConnectionAlert message={connectionLoading.pingErrorMessage} isError={true} />}

                    <DialogFooter className="flex w-full gap-2">
                        <Button
                            disabled={connectionLoading.authorization || connectionLoading.ping || connectionLoading.authorizationError || connectionLoading.pingError}
                            type="reset"
                            variant="destructive"
                            className="w-[10%]"
                            onClick={() => form.reset()}
                        >
                            <RefreshCcw />
                        </Button>
                        <Button disabled={connectionLoading.authorization || connectionLoading.ping} type="submit" className="grow">
                            Save & Connect
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    )
}


const ConnectionAlert = ({ message, isError }: { message: string, isError: boolean }) => {
    return (
        <Alert variant={isError ? "destructive" : "default"}>
            <Terminal />
            <AlertTitle>Connection Error</AlertTitle>
            <AlertDescription>
                {message}
            </AlertDescription>
        </Alert>
    )
}

const Loader = ({ className }: { className?: string }) => {
    return (
        <svg className={`mr-3 -ml-1 size-5 animate-spin text-primary ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
    )
}