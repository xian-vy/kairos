'use client'

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Database } from "@/types/database.types"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Check, X } from "lucide-react"
import { useUserGroup } from "@/hooks/useUserGroup"
import useCurrentUser from "@/hooks/useCurrentUser"
import { Button } from "@/components/ui/button"

interface TransformedGroupMember {
  user_id: string
  users: {
    email: string
    display_name: string | null
    status: Database['public']['Tables']['users']['Row']['status']
  }
}

const UsersList = () => {
  const [members, setMembers] = useState<TransformedGroupMember[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const supabase = createClientComponentClient<Database>()
  const { toast } = useToast()
  const { group } = useUserGroup()
  const { currentUser } = useCurrentUser()

  useEffect(() => {
    const fetchGroupMembers = async () => {
      try {
        if (!currentUser || !group?.id) return

        // Check if current user is admin (group creator)
        setIsAdmin(currentUser.id === group.created_by)

        // Fetch users directly from users table
        const { data: users, error: membersError } = await supabase
          .from('users')
          .select(`
            id,
            username,
            email,
            status
          `)
          .eq('group_id', group.id)

        if (membersError) throw membersError

        const transformedMembers = users.map(user => ({
          user_id: user.id,
          users: {
            email: user.email,
            display_name: user.username,
            status: user.status
          }
        })) as TransformedGroupMember[]

        setMembers(transformedMembers)
      } catch (error) {
        console.error('Error fetching group members:', error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load group members",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchGroupMembers()
  }, [supabase, toast, currentUser, group])

  const updateUserStatus = async (userId: string, newStatus: 'accepted' | 'pending') => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ status: newStatus })
        .eq('id', userId)
        .eq('group_id', group?.id)

      if (error) throw error

      // Update local state
      setMembers(members.map(member => 
        member.user_id === userId 
          ? { ...member, users: { ...member.users, status: newStatus } }
          : member
      ))

      toast({
        title: "Success",
        description: `User status updated to ${newStatus}`,
      })
    } catch (error) {
      console.error('Error updating user status:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user status",
      })
    }
  }

  if (loading) {
    return <div className="flex justify-center p-4">Loading users...</div>
  }

  const pendingMembers = members.filter(member => member.users.status === 'pending')
  const acceptedMembers = members.filter(member => member.users.status === 'accepted')

  const MemberCard = ({ member }: { member: TransformedGroupMember }) => (
    <Card key={member.user_id} className="border-[#1F2137] bg-[#0D0F23]/50 backdrop-blur-sm">
      <CardContent className="py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1.5">
                <User className="h-3 w-3 text-[#E2E4FF]" />
                <h3 className="!text-sm font-semibold text-[#E2E4FF]">
                  {member.users.display_name || 'No name'}
                </h3>
              </div>
              <p className="text-xs text-[#B4B7E5]">
                {member.users.email}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && member.user_id !== currentUser?.id && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateUserStatus(
                  member.user_id, 
                  member.users.status === 'pending' ? 'accepted' : 'pending'
                )}
                className="h-8 px-2 text-[#B4B7E5] hover:text-[#E2E4FF]"
              >
                {member.users.status === 'pending' ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <X className="h-4 w-4" />
                )}
              </Button>
            )}
            <Badge 
              variant={member.users.status === 'accepted' ? 'default' : 'secondary'}
              className={
                member.users.status === 'accepted'
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-[#1F2137] hover:bg-[#2A2D4B]'
              }
            >
              {member.users.status}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-[#E2E4FF]">Accepted Members</h2>
        {acceptedMembers.length === 0 ? (
          <p className="text-center text-[#B4B7E5] py-4">No accepted members</p>
        ) : (
          acceptedMembers.map(member => <MemberCard key={member.user_id} member={member} />)
        )}
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-[#E2E4FF]">Pending Members</h2>
        {pendingMembers.length === 0 ? (
          <p className="text-center text-[#B4B7E5] py-4">No pending members</p>
        ) : (
          pendingMembers.map(member => <MemberCard key={member.user_id} member={member} />)
        )}
      </div>
    </div>
  )
}

export default UsersList
