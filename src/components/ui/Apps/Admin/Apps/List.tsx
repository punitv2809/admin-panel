import { Button } from "@/components/ui/button"
import { useBreadcrumbStore } from "@/components/ui/stores/breadcrumb"
import { Plus } from "lucide-react"
import { useEffect } from "react"

import { z } from "zod";

export const SubStepSchema = z.object({
  name: z.string(),
  code: z.string()
});

export const StepSchema = z.object({
  name: z.string(),
  code: z.string(),
  hint: z.string(),
  sub_step: z.array(SubStepSchema)
});

export const MarketplaceConfigSchema = z.object({
  _id: z.string(),
  target_marketplace: z.string(), // base64-encoded JSON
  name: z.string(),
  url: z.string().url(),
  type: z.string(), // could be enum if restricted (e.g., 'marketplace')
  status: z.string(), // e.g., "Active"
  additional_input: z.string(),
  group_code: z.string(),
  code: z.string(),
  erase_data_after_uninstall: z.string(), // "0", maybe should be z.enum(["0", "1"])
  erase_data_after_unit: z.string(), // e.g., "hours"
  webhooks: z.array(z.unknown()), // or use more specific schema if known
  marketplace: z.string(),
  steps: z.array(StepSchema)
});

export type MarketplaceConfig = z.infer<typeof MarketplaceConfigSchema>;

const List = () => {
    const setBreadcrumb = useBreadcrumbStore((s) => s.setBreadcrumb)
    const setHeaderContent = useBreadcrumbStore((s) => s.setHeaderContent)
    useEffect(() => {
        setBreadcrumb([
            { title: 'Admin Panel', href: '/app/admin' },
            { title: 'Apps', href: '/app/admin/apps' },
            { title: 'List' },
        ])

        setHeaderContent(
            <Button size="sm" onClick={() => 1}>
                <Plus className="h-4 w-4" />
                Add App
            </Button>
        )

        return () => setHeaderContent(null)
    }, [])
  return (
    <div className="p-6 space-y-6">List</div>
  )
}

export default List