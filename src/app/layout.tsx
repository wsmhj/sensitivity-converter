import type {Metadata} from 'next';
import Script from 'next/script';
import AnalyticsTracker from '@/components/analytics-tracker';
import Shell,{Footer} from '@/components/shell';
import {site} from '@/lib/site';
import './globals.css';
import './gaming.css';
export const metadata:Metadata={metadataBase:new URL(site.origin),title:{default:site.title,template:'%s | Turnmatch'},description:site.description,openGraph:{title:site.title,description:site.description,type:'website',siteName:site.name},twitter:{card:'summary',title:site.title,description:site.description}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" data-theme="dark"><body><a className="skip-link" href="#main">Skip to content</a><Shell/><main id="main">{children}</main><Footer/><AnalyticsTracker/><Script src="/feedback-widget.js" data-feedback-manual="" strategy="afterInteractive"/></body></html>;}
