import { Button } from "@/components/ui/button"
import { useBreadcrumbStore } from "@/components/ui/stores/breadcrumb"
import { Plus } from "lucide-react"
import { useEffect } from "react"

const List = () => {
    const setBreadcrumb = useBreadcrumbStore((s) => s.setBreadcrumb)
    const setHeaderContent = useBreadcrumbStore((s) => s.setHeaderContent)
    useEffect(() => {
        setBreadcrumb([
            { title: 'Admin Panel', href: '/app/admin' },
            { title: 'Channels', href: '/app/admin/channels' },
            { title: 'List' },
        ])

        setHeaderContent(
            <Button size="sm" onClick={() => 1}>
                <Plus className="h-4 w-4" />
                Add Channel
            </Button>
        )

        return () => setHeaderContent(null)
    }, [])
  return (
    <div className="p-6 space-y-6">List</div>
  )
}

export default List