"use client";

import { Disclosure, DisclosureButton, DisclosurePanel, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { ReactNode } from 'react'

interface SidebarDropdownSectionProps {
  title: string
  children: ReactNode
  defaultOpen?: boolean
  className?: string
  isActive?: boolean
}

export function SidebarDropdownSection({ 
  title, 
  children, 
  defaultOpen = false,
  className = "",
  isActive = false
}: SidebarDropdownSectionProps) {
  return (
    <Disclosure defaultOpen={defaultOpen}>
      {({ open }) => (
        <div className={`rounded-lg transition-all duration-300 ${className}`}>
          <DisclosureButton className={`
            flex w-full justify-between items-center p-4 rounded-lg transition-all duration-300 group
            ${isActive
              ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
              : "text-secondary-700 dark:text-secondary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400"
            }
          `}>
            <span className="font-semibold text-left text-base">
              {title}
            </span>
            <ChevronDownIcon
              className={`${
                open ? 'rotate-180 transform' : ''
              } h-4 w-4 transition-transform duration-300 ${
                isActive
                  ? "text-primary-500"
                  : "text-secondary-500 group-hover:text-primary-500"
              }`}
            />
          </DisclosureButton>
          
          <Transition
            show={open}
            enter="transition-all ease-out duration-300"
            enterFrom="transform opacity-0 -translate-y-2"
            enterTo="transform opacity-100 translate-y-0"
            leave="transition-all ease-in duration-200"
            leaveFrom="transform opacity-100 translate-y-0"
            leaveTo="transform opacity-0 -translate-y-2"
          >
            <DisclosurePanel static className="mt-2 space-y-0">
              {children}
            </DisclosurePanel>
          </Transition>
        </div>
      )}
    </Disclosure>
  )
}