import { Dispatch, SetStateAction } from 'react';
import { Pencil, X } from 'lucide-react';

interface ProfileNameProps {
  edit: boolean,
  setEdit: Dispatch<SetStateAction<boolean>>,
  newName: string,
  setNewName: Dispatch<SetStateAction<string>>
  handleChangeName: () => Promise<void>
}

export const ProfileName = ({ setEdit, edit, newName, setNewName, handleChangeName }: ProfileNameProps) => {
  return (
    <>
      {
        edit
          ?
          <div className='flex justify-center items-center space-x-4'>
            <input className='rounded-md border-0 p-1 py-1.5 text-gray-900 shadow-m ring-1 ring-inset ring-gray-300 placeholder:text-gray-400
                                  focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6 text-4xl'
                   placeholder='Your new name' onChange={(e) => setNewName(e.target.value)}
            />
            <div className='flex space-x-2 '>
                  <span className='has-tooltip'>
                  <Pencil className='cursor-pointer text-emerald-800' onClick={handleChangeName} />
                  <span className='tooltip rounded shadow-lg p-2 bg-gray-100 text-emerald-700 mt-2'
                  >
                    Edit
                  </span>
                  </span>
              <span className='has-tooltip'>
                  <X className='cursor-pointer text-red-800' onClick={() => setEdit(false)} />
                  <span className='tooltip rounded shadow-lg p-2 bg-gray-100 text-red-700 mt-2'>Cancel</span>
                  </span>
            </div>
          </div>
          : <h1 className='text-4xl font-medium text-gray-700'>{newName}</h1>
      }
    </>
  );
};

