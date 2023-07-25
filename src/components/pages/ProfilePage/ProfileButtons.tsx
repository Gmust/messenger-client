import { Dispatch, SetStateAction } from 'react';
import { Session } from 'next-auth';

import { Button } from '@/components/shared/Button';

interface ProfileButtonsProps {
  session: Session,
  _id: string,
  loading: boolean,
  friends: User[],
  edit: boolean,
  handleStartMessaging: () => void,
  handleAddToFriends: () => void,
  handleRemoveFromFriends: () => void,
  setEdit: Dispatch<SetStateAction<boolean>>
}


export const ProfileButtons = ({
                                 friends,
                                 handleRemoveFromFriends,
                                 handleAddToFriends,
                                 handleStartMessaging,
                                 session,
                                 _id,
                                 loading,
                                 setEdit,
                                 edit
                               }: ProfileButtonsProps) => {
  return (
    <div className='space-x-8 flex justify-between mt-32 md:mt-0 md:justify-center'>
      {
        session?.user.id === _id ?
          <>
            {edit ?
              <Button className='py-7 px-4 uppercase font-medium' isLoading={loading} onClick={() => setEdit(!edit)}>
                Cancel editing
              </Button>
              :
              <Button className='py-7 px-4 uppercase font-medium' isLoading={loading} onClick={() => setEdit(!edit)}>
                Edit Profile
              </Button>
            }
          </>
          :
          <>
            {friends.some((friend) => friend._id === session?.user.id) ?
              <Button className='py-7 px-4 uppercase font-medium  bg-red-500 hover:bg-red-700' isLoading={loading}
                      onClick={handleRemoveFromFriends}>
                Delete from friends
              </Button>
              :
              <Button className='py-7 px-4 uppercase font-medium  bg-indigo-700' isLoading={loading}
                      onClick={handleAddToFriends}>
                Add to friends
              </Button>
            }
            <Button className='py-7 px-4 uppercase font-medium' onClick={handleStartMessaging}
                    isLoading={loading}>
              Message
            </Button>
          </>
      }
    </div>
  );
};

