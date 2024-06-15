import { File } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Checkbox } from '../ui/checkbox'
import { useState } from 'react'
import { LoadingButton } from './loadingButton'

export const ExportPlansButton = () => {
  const [committee, setCommittee] = useState('all')
  const [onlyBookableLocationValla, setOnlyBookableLocationValla] = useState(true)
  const [includeInventory, setIncludeInventory] = useState(false)

  // NOTE - maybe this should be converted to a form?
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="h-7 gap-1 text-sm">
          <File className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only">Export</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Exportera planeringar</DialogTitle>
          <DialogDescription className="space-y-1.5">
            <p>Exporterar planeringarnas data till en CSV fil.</p>
            <p>
              Används främst för att exportera bokningsbara områden på Valla campus och skicka till
              universitetet.
            </p>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div>
            <Label>Välj kår</Label>
            <Select value={committee} onValueChange={setCommittee}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alla</SelectItem>
                <SelectItem value="consensus">Consensus</SelectItem>
                <SelectItem value="lintek">LinTek</SelectItem>
                <SelectItem value="stuff">StuFF</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex space-x-2">
            <Checkbox
              checked={onlyBookableLocationValla}
              onCheckedChange={() => setOnlyBookableLocationValla((prev) => !prev)}
            />
            <Label>Endast områden campus Valla</Label>
          </div>
          <div className="flex space-x-2">
            <Checkbox
              checked={includeInventory}
              onChange={() => setIncludeInventory((prev) => !prev)}
            />
            <Label>Inkludera inventarier</Label>
          </div>
        </div>
        <DialogFooter>
          <LoadingButton size="sm" loading>
            Exportera
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
