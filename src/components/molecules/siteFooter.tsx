import { siteConfig } from '@/config/site'

export function SiteFooter() {
  return (
    <footer className="bottom-0 w-full md:px-6">
      <div className="flex flex-col items-center justify-between gap-4 md:h-12 md:flex-row">
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
          Byggt av{' '}
          <a
            href={siteConfig.links.portfolio}
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            Michelle
          </a>
          . Koden finns på{' '}
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </footer>
  )
}
