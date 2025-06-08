// In your page/component

import { Input } from "@/components/ui/input" // ShadCN Input
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select" // ShadCN Select

import { Search, AtSign } from "lucide-react" // Example icons
import { Adornment } from "@/components/ui/adormment"

export function TestAdornment() {
  return (
    <div className="p-10 space-y-6 max-w-md">
      {/* Example 1: Left Adornment */}
      <div>
        <Adornment className="mt-1">
          <Adornment.Item>https://</Adornment.Item>
          <Input type="text" id="url" placeholder="example.com" />
        </Adornment>
      </div>

      {/* Example 2: Right Adornment (Icon) */}
      <div>
        <Adornment className="mt-1">
          <Input type="search" id="search" placeholder="Search items..." />
          <Adornment.Item>
            <Search className="h-4 w-4 text-muted-foreground" />
          </Adornment.Item>
        </Adornment>
      </div>

      {/* Example 3: Both Adornments */}
      <div>
        <Adornment className="mt-1">
          <Adornment.Item>
            <AtSign className="h-4 w-4" />
          </Adornment.Item>
          <Input type="text" id="username" placeholder="yourname" />
          <Adornment.Item>@domain.com</Adornment.Item>
        </Adornment>
      </div>

      {/* Example 3: Both Adornments */}
      <div>
        <Adornment className="mt-1">
          <Adornment.Item>
            <AtSign className="h-4 w-4" />
          </Adornment.Item>
          <Input type="text" id="username" placeholder="yourname" />
          <Adornment.Item className="w-40">
            @domainBetterStrongFaster.com
          </Adornment.Item>
        </Adornment>
      </div>

      {/* Example 4: With ShadCN Select */}
      <div>
        <Adornment className="mt-1">
          <Adornment.Item>$</Adornment.Item>
          <Select>
            <SelectTrigger id="currency" className="w-full">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="usd">USD</SelectItem>
              <SelectItem value="eur">EUR</SelectItem>
              <SelectItem value="gbp">GBP</SelectItem>
            </SelectContent>
          </Select>
        </Adornment>
      </div>

      {/* Example 6: Disabled State */}
      <div>
        <Adornment className="mt-1">
          {" "}
          {/* Or pass disabled to Input */}
          <Adornment.Item>https://</Adornment.Item>
          <Input
            disabled
            type="text"
            id="disabled-url"
            placeholder="example.com"
          />
        </Adornment>
      </div>

      {/* Example 7: Custom Class */}
      <div>
        <Adornment className="mt-1">
          <Input type="text" id="disabled-url" placeholder="example.com" />
          <Adornment.Item>
            <Select>
              <SelectTrigger id="currency" className="w-full bg-white">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usd">USD</SelectItem>
                <SelectItem value="eur">EUR</SelectItem>
                <SelectItem value="gbp">GBP</SelectItem>
              </SelectContent>
            </Select>
          </Adornment.Item>
        </Adornment>
      </div>
    </div>
  )
}
