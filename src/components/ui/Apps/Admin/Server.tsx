import { cn } from "@/lib/utils"
import { Pencil, Plus, Trash } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

type ServerProps = {
  className?: string
  name: string
  status: string
  host: string
  pingUrl: string
  onShowAuthToken: () => void
  onToggleActive: () => void
  onDelete: () => void
  onEdit: () => void
}

const Server = ({ className, name, status, host, pingUrl, onShowAuthToken, onToggleActive, onDelete, onEdit }: ServerProps) => {
  return (
    <div className={cn("border rounded-md bg-sidebar divide-y shadow-xl", className)}>
    <div className="flex items-center justify-between p-3">
      <div className="flex flex-col items-start gap-1">
        <p className="text-lg font-medium capitalize">{name}</p>
        <Badge variant="outline">{status}</Badge>
      </div>
      <div className="">
        <Switch checked={status === "active"} onCheckedChange={onToggleActive} />
      </div>
    </div>
    <div className="px-3">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="server-details">
          <AccordionTrigger className="text-sm">Server Details</AccordionTrigger>
          <AccordionContent className="space-y-2">
            <div className="">
              <Label className="text-xs">Host</Label>
              <p className="text-xs text-muted-foreground">{host}</p>
            </div>
            <div className="">
              <Label className="text-xs">Ping Url</Label>
              <p className="text-xs text-muted-foreground">{pingUrl}</p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
    <div className="flex items-center justify-end gap-2 p-3">
      <Button size="sm" variant="ghost" onClick={onEdit}><Pencil className="h-4 w-4" /></Button>
      <Button size="sm" variant="outline" onClick={onShowAuthToken}>
        <Plus className="h-4 w-4" />
        Show Auth Token
      </Button>
      <Button size="sm" variant="destructive" onClick={onDelete}><Trash className="h-4 w-4" /></Button>
    </div>
  </div>
  )
}

export default Server