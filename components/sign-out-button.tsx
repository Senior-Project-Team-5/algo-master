'use client'

import { useClerk } from '@clerk/nextjs'
import { Button } from './ui/button'
import Image from 'next/image';

type Props = {
    label: string;
    iconSrc: string;
}

export const SignOutButton = ({ label, iconSrc }: Props) => {
  const { signOut } = useClerk()
  
  return (
    // Clicking this button signs out a user
    // and redirects them to the home page "/".
    <Button 
        onClick={() => signOut({ redirectUrl: '/' })}
        variant={"sidebar"}
        className="justify-start h-[52px]"
    >
        <Image
            src={iconSrc}
            alt={label}
            className="mr-5"
            height={25}
            width={25}
        />
        {label}
    </Button>
  )
}