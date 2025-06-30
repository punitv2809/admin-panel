import { useEffect, useState } from 'react'
import { useBreadcrumbStore } from '../../stores/breadcrumb'
import { Button } from '../../button'
import { Key, Plus, Trash, Pencil } from 'lucide-react'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import SetupForm from './SetupForm'
import { JwtTable } from './JwtTable'
import { Textarea } from '../../textarea'
import { useAdminAppStore, type User } from '../../stores/admin.app.store'
import { ApiMap, request } from './ApiMap'

/**
 * Decodes a JWT token and returns the payload as the specified type.
 * @param token The JWT token string.
 * @returns The decoded payload as type T, or null if decoding fails.
 */
export function decodeJwt<T = unknown>(token: string): T | null {
    try {
        const payloadBase64 = token.split('.')[1]
        if (!payloadBase64) return null

        const payloadJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'))
        return JSON.parse(payloadJson) as T
    } catch (error) {
        console.error('Invalid JWT token:', error)
        return null
    }
}


const Setup = () => {
    const setBreadcrumb = useBreadcrumbStore((s) => s.setBreadcrumb)
    const setHeaderContent = useBreadcrumbStore((s) => s.setHeaderContent)

    const servers = useAdminAppStore((s) => s.backendServers)
    const removeServer = useAdminAppStore((s) => s.removeServer)
    const updateServer = useAdminAppStore((s) => s.updateServer)
    const setUser = useAdminAppStore((s) => s.setUser)

    const [activeBackend, setActiveBackend] = useState<string>('unicon monolith local')
    const [dialogMode, setDialogMode] = useState<'create' | 'edit' | null>(null)
    const [showAuthDialog, setShowAuthDialog] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)
    const [editIndex, setEditIndex] = useState<number | null>(null)
    const [showDecodedToken, setShowDecodedToken] = useState(false)
    useEffect(() => {
        setBreadcrumb([
            { title: 'Admin Panel', href: '/app/admin' },
            { title: 'Settings', href: '/app/admin/settings' },
            { title: 'Setup' },
        ])

        setHeaderContent(
            <Button size="sm" onClick={() => {
                setDialogMode('create')
                setOpenDialog(true)
            }}>
                <Plus className="mr-2 h-4 w-4" />
                Add Backend
            </Button>
        )

        return () => setHeaderContent(null)
    }, [])

    const getStatusVariant = (status: string) => {
        if (status === 'active') return 'primary'
        if (status === 'down') return 'destructive'
        return 'secondary'
    }

    const getHost = (url: string) => {
        try {
            return new URL(url).hostname
        } catch {
            return url
        }
    }
    
    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-semibold">
                    Backend Apps <span className="text-muted-foreground text-sm">({servers.length})</span>
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Manage your connected backend services and server configurations.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {servers.map((app, idx) => (
                    <Card key={idx}>
                        <CardHeader className="flex flex-row justify-between items-center space-y-0">
                            <div className="flex flex-col items-start">
                                <div>
                                    <CardTitle>{app.name}</CardTitle>
                                    <CardDescription>{app.description}</CardDescription>
                                </div>
                                <div className="flex items-center justify-center gap-2">
                                    <Badge variant={getStatusVariant("active")} className="text-xs capitalize mt-1">
                                        active
                                    </Badge>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Switch
                                    id={`active-switch-${idx}`}
                                    checked={activeBackend === app.name}
                                    onCheckedChange={() => setActiveBackend(app.name)}
                                />
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-3 border-t pt-4 text-sm">
                            <div>
                                <Label className="text-xs text-muted-foreground">Host</Label>
                                <p>{getHost(app.host)}</p>
                            </div>
                            <div>
                                <Label className="text-xs text-muted-foreground">Ping URL</Label>
                                <p>{app.pingPath}</p>
                            </div>
                        </CardContent>

                        <CardFooter className="border-t pt-4 flex justify-between items-center">
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={async() => {
                                    setEditIndex(idx)
                                    setShowAuthDialog(true)
                                    const user = await request("getUser", { token: servers[idx].authorization ?? "", host: servers[idx].host }, {})
                                    setUser(user.data as User)
                                }}>
                                    <Key className="mr-2 h-4 w-4" />
                                    Show Authorization
                                </Button>

                                <Button onClick={() => removeServer(idx)} size="sm" variant="destructive">
                                    <Trash className="mr-2 h-4 w-4" />
                                    Remove
                                </Button>
                            </div>
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => {
                                    setDialogMode('edit')
                                    setOpenDialog(true)
                                }}
                            >
                                <Pencil className="w-4 h-4" />
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <SetupForm
                    defaultValues={editIndex !== null ? servers[editIndex] : undefined}
                    onClose={() => {
                        setOpenDialog(false)
                        setEditIndex(null)
                    }}
                    editIndex={editIndex}
                />
            </Dialog>

            {editIndex !== null && (
                <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Authorization</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <Label>Show decoded token</Label>
                                <Switch
                                    id="show-decoded-token"
                                    checked={showDecodedToken}
                                    onCheckedChange={setShowDecodedToken}
                                />
                            </div>
                            {showDecodedToken && (
                                <div className="flex flex-col gap-2">
                                    <JwtTable data={decodeJwt(servers[editIndex]?.authorization ?? "") ?? {}} />
                                </div>
                            )}
                            {!showDecodedToken && (
                                <Textarea value={servers[editIndex]?.authorization ?? ""} className="resize-none break-all" readOnly />
                            )}
                        </div>
                        <DialogFooter>
                            <Button variant="outline" size="sm" onClick={() => {
                                navigator.clipboard.writeText(JSON.stringify(decodeJwt(servers[editIndex]?.authorization ?? ""), null, 2))
                                toast.success("Copied to clipboard")
                            }}>Copy Decoded Token</Button>
                            <Button onClick={() => {
                                navigator.clipboard.writeText(servers[editIndex]?.authorization ?? "")
                                toast.success("Copied to clipboard")
                                console.log(decodeJwt(servers[editIndex]?.authorization ?? ""))
                            }} size="sm">
                                Copy
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

        </div>
    )
}

export default Setup
