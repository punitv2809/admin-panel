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
import { RefreshCcw } from "lucide-react"
import { useAdminAppStore } from "../../stores/admin.app.store"

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    host: z.string().min(1, "Host is required"),
    usernameOrEmail: z.string().min(1, "Username or email is required"),
    password: z.string().min(1, "Password is required"),
    pingPath: z
        .string()
        .min(1, "Ping path is required")
        .startsWith("/", "Ping path must start with '/'"),
    inUse: z.boolean().optional(),
})

type SetupFormProps = {
    defaultValues?: Partial<z.infer<typeof formSchema>>
    onClose?: () => void
    editIndex?: number | null
}


export default function SetupForm({ defaultValues, onClose, editIndex }: SetupFormProps) {
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
            ...defaultValues,
        }
    })

    const addServer = useAdminAppStore((s) => s.addServer)
    const updateServer = useAdminAppStore((s) => s.updateServer)

    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            if (editIndex != null) {
                updateServer(editIndex, values)
            } else {
                addServer(values)
            }

            toast("Saved successfully")
            onClose?.()
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

                    <DialogFooter className="flex w-full gap-2">
                        <Button
                            type="reset"
                            variant="destructive"
                            className="w-[10%]"
                            onClick={() => form.reset()}
                        >
                            <RefreshCcw />
                        </Button>
                        <Button type="submit" className="grow">
                            Submit
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    )
}
