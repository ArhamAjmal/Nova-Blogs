import { UserProfile } from "@clerk/nextjs";
import styles from './library.module.css'
import { auth, currentUser } from "@clerk/nextjs/server";
import SigninWrapper from "./SigninWrapper";

export default async function UserAccount() {
const user = await currentUser();
if(!user){
  return(<main style={{minHeight:"100vh"}}>
     <div style={{fontSize:"1.9rem",textAlign:"center",marginTop:"2rem",color:"#727272"}}>No user found</div>
     <SigninWrapper/>
    </main>)
}
  return(
    <div data-clerk-user-profile-root="true">
      <UserProfile />
    </div>
  ) 
}
