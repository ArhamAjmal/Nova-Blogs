import React from 'react'
import NavBar from '../../components/allblogs/NavBar'
import Content from '../../components/allblogs/Content'
import Filter from '../../components/categories/Filter'
import CatNames from '../../components/categories/CatNames'
import Footer from '../../components/Footer/Footer'
import { auth, currentUser } from "@clerk/nextjs/server";

import CreatUser from '@/app/components/action/CreatUser'
import checkAdmin from '@/app/actions/checkAdmin'
// import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
//server component
const page =async () => {
 const user = await currentUser();
//  console.log(await checkAdmin())
console.log("user:",user?.primaryEmailAddress.emailAddress)
  return (
    <div >
      {user && <CreatUser/>}
      
      <CatNames/>
      <Content/>
      {/* <SignedIn>
        <UserButton/>
      </SignedIn>
      <SignedOut>
        <SignInButton/>
      </SignedOut> */}
    </div>
  )
}

export default page
/**Clerk steps
 * 1)install->npm install @clerk/nextjs
 * 2).env->isi keys k through clerk is application k sath connect kre ga
 * 3)middleware
 * 4)layout.js(import and use clerk provider)
 * 5)declare the public pages on middleware.js
 */
/**Clerk Ui components
   <SignIn />
   <SignUp />
   <GoogleOneTap />
   <UserButton />
   <UserProfile />
   <CreateOrganization />
   <OrganizationProfile />
   <OrganizationSwitcher />
   <OrganizationList />
   <Waitlist />
 */
/**User properties(user.id,user.username,user.emailAddresses,user.primaryEmailAddress.emailAddress,user.fullName,user.firstName, user.lastName,user.imageUrl)
 * UseUser for for client side
 * current user for server side
 * 
 */
