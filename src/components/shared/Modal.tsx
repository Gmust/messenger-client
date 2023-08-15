import { Dispatch, Fragment, SetStateAction } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { MessageType } from '@/types/enums';
import { Message } from '@/types/chat';

interface ModalProps {
  isOpen: boolean,
  setIsOpen: Dispatch<SetStateAction<boolean>>,
  children: React.ReactNode,
  setMessageType?: Dispatch<SetStateAction<MessageType>>,
  setOpenedMap?: Dispatch<SetStateAction<Message | null>>
  setOpenedImg?: Dispatch<SetStateAction<string>>
  setOpenedVideo?: Dispatch<SetStateAction<string>>
}

export default function Modal({
                                setIsOpen,
                                isOpen,
                                children,
                                setMessageType,
                                setOpenedVideo,
                                setOpenedImg,
                                setOpenedMap
                              }: ModalProps) {

  function closeModal() {
    setIsOpen(false);
    setOpenedVideo && setOpenedVideo('');
    setOpenedImg && setOpenedImg('');
    setOpenedMap && setOpenedMap(null);
    setMessageType && setMessageType(MessageType.Text);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClick={closeModal} onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black bg-opacity-25' />
        </Transition.Child>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center '>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              {children}
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
