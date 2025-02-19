'use client';

import { UserProfile } from "@clerk/nextjs";

export const HomeIcon = () => {
    return (
        // <span role="img" aria-label="house">
        //     🏠
        // </span>
        <div>
            🏠
        </div>
    )
}

const ProfilePage = () => {
    return ( 
        <div className="flex flex-col items-center justify-center h-screen">
            <UserProfile>
                <UserProfile.Link label="Homepage" url="/home" labelIcon={<HomeIcon />} />
            </UserProfile>
        </div>
     );
}

export default ProfilePage;
