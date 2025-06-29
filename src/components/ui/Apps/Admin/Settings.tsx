import React, { useEffect } from 'react'
import { useBreadcrumbStore } from '../../stores/breadcrumb'
import { Table, TableBody, TableCell, TableRow } from '../../table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../dropdown-menu'
import { Button } from '../../button'
import { Cog } from 'lucide-react'
import { useNavigate } from 'react-router'

const Settings = () => {
  const navigate = useNavigate()
  const setBreadcrumb = useBreadcrumbStore((s) => s.setBreadcrumb)

  useEffect(() => {
    setBreadcrumb([
      { title: "Admin Panel", href: "/app/admin" },
      { title: "Settings" },
    ])
  }, [])

  return (
    <div>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Theme</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button size={'sm'} variant="outline" className="w-full">
                    Dark
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Billing</DropdownMenuItem>
                  <DropdownMenuItem>Team</DropdownMenuItem>
                  <DropdownMenuItem>Subscription</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Backend Keys</TableCell>
            <TableCell className="text-right">
              <Button onClick={() => navigate('setup')} size={'sm'}><Cog /> Configure</Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

export default Settings
