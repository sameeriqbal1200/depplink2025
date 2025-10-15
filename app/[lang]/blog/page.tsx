// app/[lang]/blog/page.tsx (SERVER COMPONENT - remove "use client")
import { getBlogsData } from '@/lib/blogs/blogListing.server';
import BlogClientPage from './BlogClientPage';

export default async function BlogsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const blogsData = await getBlogsData(searchParams);

  return <BlogClientPage 
    initialBlogsData={blogsData} 
    searchParams={searchParams} 
  />;
}