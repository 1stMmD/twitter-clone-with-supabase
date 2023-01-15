import { PostgrestError } from "@supabase/supabase-js"
import { useEffect , useState , useLayoutEffect } from "react"
import supabase from "../../libs/supabase"
import { useSelector } from "react-redux"
import { rootType } from "../../redux/store"

export const useGetBookmarkedPosts = (max : number | undefined = 10) => {
    const [ posts , setPosts ] = useState<any>(null)
    const [ hasMore , setHasMore ] = useState<boolean>(false)
    const [ pending , setPending ] = useState<boolean>(true)
    const [ err , setErr ] = useState<PostgrestError | null>(null)
    const user = useSelector((state : rootType) => state.AuthSlice.user);

    useEffect(() => {
        const func = async () => {
            if(max === 10) setPending(true)
            const {data , count , error} = await supabase
                .from("posts")
                .select("*" , {count : "exact"})
                .contains("bookmarked_by",[user])
                .range(0,max)

            if(error){
                setPosts(null)
                setHasMore(false)
                setPending(false)
                setErr(error)
                return
            }

            setPosts(data)
            setHasMore(max < (count || 0))
            setPending(false)
            setErr(null)

        }
        func()
    },[max])

    return [posts,hasMore,pending,err]
}