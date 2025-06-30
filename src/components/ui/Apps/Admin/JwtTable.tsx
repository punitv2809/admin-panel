import type { FC } from "react"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"

type JwtTokenPayload = Record<string, string | number | boolean | null>

interface JwtTableProps {
  data: JwtTokenPayload
}

const formatExpiry = (exp: number) => {
  const now = Math.floor(Date.now() / 1000)
  const diff = exp - now

  if (diff <= 0) {
    return <Badge variant="destructive">Expired</Badge>
  } else if (diff < 3600) {
    return <Badge variant="secondary">Expiring Soon</Badge>
  } else {
    const date = new Date(exp * 1000).toLocaleString()
    return <Badge variant="default">Valid until {date}</Badge>
  }
}

export const JwtTable: FC<JwtTableProps> = ({ data }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">Key</TableHead>
            <TableHead>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(data).map(([key, value]) => (
            <TableRow key={key}>
              <TableCell className="font-medium">{key}</TableCell>
              <TableCell>
                {key === "exp" && typeof value === "number"
                  ? formatExpiry(value)
                  : String(value)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
