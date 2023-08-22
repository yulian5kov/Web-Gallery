// import { useEffect } from "react"
// import { useAuthContext } from "../hooks/useAuthContext"

const Home = () => {
    // global user state
    // const {user} = useAuthContext()

//     useEffect(() => {
//     const fetchWorkouts = async () => {
//         const response = await fetch('/api/workouts', {
//             headers: {
//             'Authorization' : `Bearer ${user.token}`
//             }
//         })
//         const json = await response.json()

//         if (response.ok) {
//             dispatch({type: 'SET_WORKOUTS', payload: json})
//         }
//     }
//     if(user){
//         fetchWorkouts()
//     }
//   }, [dispatch, user])

  return (
    <div className="home">
        <h1>Home</h1>
    </div>
  )
}

export default Home