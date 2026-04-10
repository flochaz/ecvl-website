import type { HAEvent } from '../types/events';

const HELLOASSO_API = 'https://api.helloasso.com';

interface HATokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface HAFormItem {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  url: string;
  banner?: string;
  place?: { city?: string; address?: string };
}

interface HAFormsResponse {
  data: HAFormItem[];
}

async function getAccessToken(clientId: string, clientSecret: string): Promise<string> {
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
  });

  const res = await fetch(`${HELLOASSO_API}/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!res.ok) {
    throw new Error(`HelloAsso auth failed: ${res.status} ${await res.text()}`);
  }

  const data = (await res.json()) as HATokenResponse;
  return data.access_token;
}

export async function fetchUpcomingEvents(
  clientId: string,
  clientSecret: string,
  organizationSlug: string,
): Promise<HAEvent[]> {
  const token = await getAccessToken(clientId, clientSecret);

  const url = new URL(
    `${HELLOASSO_API}/v5/organizations/${organizationSlug}/forms`,
  );
  url.searchParams.set('formType', 'Event');
  url.searchParams.set('states', 'Public');
  url.searchParams.set('pageSize', '20');

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`HelloAsso events fetch failed: ${res.status} ${await res.text()}`);
  }

  const json = (await res.json()) as HAFormsResponse;
  const now = new Date();

  return (json.data ?? [])
    .filter((e) => e.startDate && new Date(e.startDate) >= now)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 6)
    .map((e) => ({
      title: e.title,
      description: e.description ?? '',
      startsAt: e.startDate,
      endsAt: e.endDate,
      url: e.url,
      imageUrl: e.banner,
      place: e.place?.address,
      city: e.place?.city,
    }));
}
