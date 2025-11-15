"use client";

import { Disclosure, DisclosureButton, DisclosurePanel, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { ReactNode } from 'react'

interface DropdownSectionProps {
  title: string
  children: ReactNode
  defaultOpen?: boolean
  className?: string
}

export function DropdownSection({ 
  title, 
  children, 
  defaultOpen = false,
  className = "" 
}: DropdownSectionProps) {
  return (
    <Disclosure defaultOpen={defaultOpen}>
      {({ open }) => (
        <div className={`border border-secondary-200 dark:border-secondary-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}>
          <DisclosureButton className="flex w-full justify-between items-center p-6 bg-white dark:bg-secondary-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all duration-300 group">
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
              {title}
            </h2>
            <ChevronDownIcon
              className={`${
                open ? 'rotate-180 transform' : ''
              } h-5 w-5 text-secondary-500 group-hover:text-primary-500 transition-transform duration-300`}
            />
          </DisclosureButton>
          
          <Transition
            show={open}
            enter="transition-all ease-out duration-300"
            enterFrom="transform opacity-0 -translate-y-4"
            enterTo="transform opacity-100 translate-y-0"
            leave="transition-all ease-in duration-200"
            leaveFrom="transform opacity-100 translate-y-0"
            leaveTo="transform opacity-0 -translate-y-4"
          >
            <DisclosurePanel static className="px-6 pb-6 pt-4 bg-secondary-50 dark:bg-secondary-900/50 border-t border-secondary-100 dark:border-secondary-700">
              {children}
            </DisclosurePanel>
          </Transition>
        </div>
      )}
    </Disclosure>
  )
}