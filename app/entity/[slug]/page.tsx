import { permanentRedirect } from 'next/navigation';
import { getEntityIndex } from '@/lib/data/entities';
import { ROUTES } from '@/lib/site';

export const dynamicParams = false;

export function generateStaticParams() {
  return getEntityIndex().map((entity) => ({ slug: entity.slug }));
}

export default function EntityDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  permanentRedirect(ROUTES.entityDetail(params.slug));
}
