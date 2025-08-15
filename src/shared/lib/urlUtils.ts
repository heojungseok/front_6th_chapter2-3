// URL 업데이트 함수
export const updateURL = (
  skip: number,
  limit: number,
  searchQuery: string,
  sortBy: string,
  sortOrder: string,
  selectedTag: string,
  navigate: (url: string) => void,
) => {
  const params = new URLSearchParams()
  if (skip) params.set("skip", skip.toString())
  if (limit) params.set("limit", limit.toString())
  if (searchQuery) params.set("search", searchQuery)
  if (sortBy) params.set("sortBy", sortBy)
  if (sortOrder) params.set("sortOrder", sortOrder)
  if (selectedTag) params.set("tag", selectedTag)
  navigate(`?${params.toString()}`)
}

export const getUrlParams = (url: string) => {
  const params = new URLSearchParams(url)
  return {
    skip: parseInt(params.get("skip") || "0"),
    limit: parseInt(params.get("limit") || "10"),
    searchQuery: params.get("search") || "",
    sortBy: params.get("sortBy") || "",
    order: params.get("order") || "",
    selectedTag: params.get("tag") || "",
  }
}
