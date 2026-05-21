// Row types defined first to avoid circular references
type ProfileRow = { id: string; email: string | null; full_name: string | null; avatar_url: string | null; role: string; created_at: string };
type NicheRow = { id: string; name: string; slug: string; description: string | null; icon: string | null; emoji: string | null; color: string; is_active: boolean; sort_order: number; created_at: string };
type ServiceRow = { id: string; title: string; slug: string; description: string | null; short_desc: string | null; icon: string | null; color: string; is_featured: boolean; is_active: boolean; sort_order: number; created_at: string; updated_at: string };
type PlanRow = { id: string; name: string; subtitle: string | null; price: number; currency: string; period: string; features: string[]; is_featured: boolean; is_active: boolean; sort_order: number; created_at: string; updated_at: string };
type ProjectRow = { id: string; name: string; slug: string; niche_id: string | null; description: string | null; short_desc: string | null; client_name: string | null; website_url: string | null; cover_image: string | null; tags: string[]; is_featured: boolean; is_active: boolean; sort_order: number; created_at: string; updated_at: string };
type ProjectImageRow = { id: string; project_id: string; url: string; storage_path: string | null; alt_text: string | null; is_primary: boolean; sort_order: number; created_at: string };
type TestimonialRow = { id: string; name: string; role: string | null; company: string | null; niche: string | null; niche_emoji: string | null; content: string; rating: number; avatar_url: string | null; is_published: boolean; sort_order: number; created_at: string };
type ContactRow = { id: string; name: string; email: string; phone: string | null; subject: string | null; message: string; status: string; notes: string | null; created_at: string };
type QuoteRow = { id: string; name: string; email: string; phone: string | null; company: string | null; niche: string | null; budget: string | null; timeline: string | null; description: string | null; selected_plan: string | null; status: string; notes: string | null; created_at: string };
type BlogCategoryRow = { id: string; name: string; slug: string; created_at: string };
type BlogPostRow = { id: string; title: string; slug: string; excerpt: string | null; content: string | null; cover_image: string | null; category_id: string | null; author_id: string | null; status: string; seo_title: string | null; seo_description: string | null; tags: string[]; published_at: string | null; created_at: string; updated_at: string };
type SubscriberRow = { id: string; email: string; is_active: boolean; source: string; created_at: string };
type SettingRow = { id: string; key: string; value: string | null; type: string; label: string | null; grp: string; updated_at: string };
type SeoRow = { id: string; page: string; title: string | null; description: string | null; keywords: string | null; og_image: string | null; updated_at: string };

export type Database = {
  public: {
    Tables: {
      profiles:              { Row: ProfileRow;       Insert: Omit<ProfileRow,"created_at">;                                          Update: Partial<ProfileRow> };
      niches:                { Row: NicheRow;         Insert: Omit<NicheRow,"id"|"created_at"> & { id?: string };                    Update: Partial<NicheRow> };
      services:              { Row: ServiceRow;       Insert: Omit<ServiceRow,"id"|"created_at"|"updated_at"> & { id?: string };     Update: Partial<ServiceRow> };
      pricing_plans:         { Row: PlanRow;          Insert: Omit<PlanRow,"id"|"created_at"|"updated_at"> & { id?: string };        Update: Partial<PlanRow> };
      portfolio_projects:    { Row: ProjectRow;       Insert: Omit<ProjectRow,"id"|"created_at"|"updated_at"> & { id?: string };     Update: Partial<ProjectRow> };
      portfolio_images:      { Row: ProjectImageRow;  Insert: Omit<ProjectImageRow,"id"|"created_at"> & { id?: string };             Update: Partial<ProjectImageRow> };
      testimonials:          { Row: TestimonialRow;   Insert: Omit<TestimonialRow,"id"|"created_at"> & { id?: string };              Update: Partial<TestimonialRow> };
      contact_submissions:   { Row: ContactRow;       Insert: Omit<ContactRow,"id"|"created_at"> & { id?: string };                  Update: Partial<ContactRow> };
      quote_requests:        { Row: QuoteRow;         Insert: Omit<QuoteRow,"id"|"created_at"> & { id?: string };                    Update: Partial<QuoteRow> };
      blog_categories:       { Row: BlogCategoryRow;  Insert: Omit<BlogCategoryRow,"id"|"created_at"> & { id?: string };             Update: Partial<BlogCategoryRow> };
      blog_posts:            { Row: BlogPostRow;      Insert: Omit<BlogPostRow,"id"|"created_at"|"updated_at"> & { id?: string };    Update: Partial<BlogPostRow> };
      newsletter_subscribers:{ Row: SubscriberRow;    Insert: Omit<SubscriberRow,"id"|"created_at"> & { id?: string };               Update: Partial<SubscriberRow> };
      settings:              { Row: SettingRow;       Insert: Omit<SettingRow,"id"|"updated_at"> & { id?: string };                  Update: Partial<SettingRow> };
      seo_settings:          { Row: SeoRow;           Insert: Omit<SeoRow,"id"|"updated_at"> & { id?: string };                      Update: Partial<SeoRow> };
    };
  };
};
