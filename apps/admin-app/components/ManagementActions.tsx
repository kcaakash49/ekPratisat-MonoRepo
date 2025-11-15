"use client";

import { AgentDetailType } from "@repo/validators";

export default function ManagementActions({agent}: {agent: AgentDetailType}) {
    return (
        <>
            <div className="mt-6 max-w-7xl">
                <h2 className="text-xl sm:text-2xl font-semibold text-secondary-700 dark:text-secondary-300 mb-6">
                    Management Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* User Management Card */}
                    <div className="p-6 border rounded-lg bg-white dark:bg-secondary-800 border-secondary-200 dark:border-secondary-700 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-lg text-secondary-800 dark:text-secondary-200">User Management</h3>
                        </div>
                        <div className="space-y-3">
                            <button
                                // onClick={() => handleEditUser(agent.id)}
                                className="w-full flex items-center gap-3 p-3 text-left hover:bg-secondary-50 dark:hover:bg-secondary-700 rounded-lg transition-colors group"
                            >
                                <svg className="w-5 h-5 text-blue-500 group-hover:text-blue-600 dark:group-hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                <div>
                                    <div className="font-medium text-secondary-700 dark:text-secondary-300">Edit Profile</div>
                                    <div className="text-sm text-secondary-500 dark:text-secondary-400">Update user information and details</div>
                                </div>
                            </button>

                            <button
                                // onClick={() => handleResetPassword(agent.id)}
                                className="w-full flex items-center gap-3 p-3 text-left hover:bg-secondary-50 dark:hover:bg-secondary-700 rounded-lg transition-colors group"
                            >
                                <svg className="w-5 h-5 text-orange-500 group-hover:text-orange-600 dark:group-hover:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <div>
                                    <div className="font-medium text-secondary-700 dark:text-secondary-300">Reset Password</div>
                                    <div className="text-sm text-secondary-500 dark:text-secondary-400">Generate new password for user</div>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Permissions & Access Card */}
                    <div className="p-6 border rounded-lg bg-white dark:bg-secondary-800 border-secondary-200 dark:border-secondary-700 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-lg text-secondary-800 dark:text-secondary-200">Permissions & Access</h3>
                        </div>
                        <div className="space-y-3">
                            <button
                                // onClick={() => handleAssignLocations(agent.id)}
                                className="w-full flex items-center gap-3 p-3 text-left hover:bg-secondary-50 dark:hover:bg-secondary-700 rounded-lg transition-colors group"
                            >
                                <svg className="w-5 h-5 text-green-500 group-hover:text-green-600 dark:group-hover:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <div>
                                    <div className="font-medium text-secondary-700 dark:text-secondary-300">Assign Locations</div>
                                    <div className="text-sm text-secondary-500 dark:text-secondary-400">Manage assigned locations and areas</div>
                                </div>
                            </button>

                            <button
                                // onClick={() => handleViewActivity(agent.id)}
                                className="w-full flex items-center gap-3 p-3 text-left hover:bg-secondary-50 dark:hover:bg-secondary-700 rounded-lg transition-colors group"
                            >
                                <svg className="w-5 h-5 text-purple-500 group-hover:text-purple-600 dark:group-hover:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <div>
                                    <div className="font-medium text-secondary-700 dark:text-secondary-300">Activity Log</div>
                                    <div className="text-sm text-secondary-500 dark:text-secondary-400">View user activity and actions</div>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Administrative Actions Card */}
                    <div className="p-6 border rounded-lg bg-white dark:bg-secondary-800 border-secondary-200 dark:border-secondary-700 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-lg text-secondary-800 dark:text-secondary-200">Administrative Actions</h3>
                        </div>
                        <div className="space-y-3">
                            <button
                                // onClick={() => handleToggleVerification(agent.id)}
                                className="w-full flex items-center gap-3 p-3 text-left hover:bg-secondary-50 dark:hover:bg-secondary-700 rounded-lg transition-colors group"
                            >
                                <svg className="w-5 h-5 text-yellow-500 group-hover:text-yellow-600 dark:group-hover:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <div className="font-medium text-secondary-700 dark:text-secondary-300">
                                        {agent.isVerified ? 'Revoke Verification' : 'Verify Agent'}
                                    </div>
                                    <div className="text-sm text-secondary-500 dark:text-secondary-400">
                                        {agent.isVerified ? 'Remove verification status' : 'Mark agent as verified'}
                                    </div>
                                </div>
                            </button>

                            <button
                                // onClick={() => handleRemoveUser(agent.id)}
                                className="w-full flex items-center gap-3 p-3 text-left hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors group text-red-600 dark:text-red-400"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                <div>
                                    <div className="font-medium">Remove User</div>
                                    <div className="text-sm">Permanently delete user account</div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}