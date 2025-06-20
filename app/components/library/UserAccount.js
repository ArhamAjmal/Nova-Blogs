import { UserProfile } from "@clerk/nextjs";
import styles from './library.module.css'

export default function UserAccount() {
  return(
    <div data-clerk-user-profile-root="true">
        <UserProfile />
    </div>
  ) 
}
