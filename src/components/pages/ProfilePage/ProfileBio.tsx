import { Dispatch, SetStateAction } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { Pencil, X } from 'lucide-react';


interface BioProps {
  edit: boolean,
  newBio: string,
  bio: string,
  setNewBio: Dispatch<SetStateAction<string>>,
  setEdit: Dispatch<SetStateAction<boolean>>,
  handleChangeBio: () => Promise<void>
}

export const ProfileBio = ({ setNewBio, newBio, edit, bio, setEdit, handleChangeBio }: BioProps) => {
  return (
    <div className='mt-12 flex flex-col justify-center'>
      {
        edit
          ?
          <div className='flex flex-col justify-center items-center space-y-3'>
            <TextareaAutosize
              rows={1}
              value={newBio}
              onChange={(e) => setNewBio(e.target.value)}
              placeholder={`Change bio or paste new`}
              className='block w-full resize-none border-1 border-gray-400 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0
                     sm:py-1.5 sm:text-base leading-6 rounded-md'
            />
            <div className='flex space-x-10 '>
                  <span className='has-tooltip'>
                  <Pencil className='cursor-pointer text-emerald-800'  onClick={handleChangeBio} />
                  <span className='tooltip rounded shadow-lg p-2 bg-gray-100 text-emerald-700 mt-2'
                       >
                    Edit
                  </span>
                  </span>
              <span className='has-tooltip'>
                  <X className='cursor-pointer text-red-800' onClick={() => {
                    setEdit(false);
                    setNewBio(bio);
                  }} />
                  <span className='tooltip rounded shadow-lg p-2 bg-gray-100 text-red-700 mt-2'>Cancel</span>
                  </span>
            </div>
          </div>
          : <p className='text-gray-600 text-center font-light lg:px-16'>{newBio}</p>
      }
    </div>
  );
};

