import { apiSuccess } from "@/lib/api-response"
import { listTemplates } from "@/lib/templates-server"

export async function GET() {
  const templates = await listTemplates()
  return apiSuccess(templates)
}
