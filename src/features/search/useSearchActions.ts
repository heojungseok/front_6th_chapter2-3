import { usePostStore } from "@entities/post"
import { getUrlParams, updateURL } from "@shared/lib/urlUtils"
import { useLocation, useNavigate } from "react-router-dom"

export const useSearchActions = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const { setSkip, setLimit, setSearchQuery, setSortBy, setOrder } = usePostStore()

  const updateSearchParams = () => {
    const { skip, limit, searchQuery, sortBy, order } = getUrlParams(location.search)
    setSkip(skip)
    setLimit(limit)
    setSearchQuery(searchQuery)
    setSortBy(sortBy)
    setOrder(order)
  }

  const updateURLParams = (
    skip: number,
    limit: number,
    searchQuery: string,
    sortBy: string,
    sortOrder: string,
    selectedTag: string,
  ) => {
    updateURL(skip, limit, searchQuery, sortBy, sortOrder, selectedTag, navigate)
  }

  return {
    updateSearchParams,
    updateURLParams,
  }
}
