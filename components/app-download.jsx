import Image from "next/image"
import { Button } from "../components/ui/button"
import Link from "next/link"

export function AppDownload() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
      <div className="text-center sm:text-left">
        <h3 className="text-xl font-bold mb-2">Download 2$weet App</h3>
        <p className="text-muted-foreground mb-4">Trade crypto on the go with our mobile app</p>
      </div>

      <div className="flex gap-4">
        {/* <Button variant="outline" className="neon-border hover:bg-primary/10 p-0 h-auto bg-transparent" asChild> */}
        <Link href="#" className="block">
          <Image
            src="/playstore-download.png"
            alt="Download on App Store and Google Play"
            width={100}
            height={40}
            className="rounded-md p-1"
          />
        </Link>
        <Link href="#" className="block">
          <Image
            src="/appstore-download.png"
            alt="Download on App Store "
            width={100}
            height={40}
            className="rounded-md p-1"
          />
        </Link>
        {/* </Button> */}
      </div>
    </div>
  )
}
