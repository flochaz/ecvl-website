export interface HAEvent {
  title: string;
  description: string;
  startsAt: string | null;
  endsAt: string | null;
  url: string;
  imageUrl?: string;
  place?: string;
  city?: string;
  formType?: string;
}
