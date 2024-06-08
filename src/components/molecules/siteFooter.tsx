import { siteConfig } from '@/config/site'

export function SiteFooter() {
  return (
    <footer className="py-2 md:px-8 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
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
