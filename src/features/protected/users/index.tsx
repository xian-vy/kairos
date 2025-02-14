'use client'

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Database } from "@/types/database.types"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User } from "lucide-react"
import { useUserGroup } from "@/hooks/useUserGroup"
import useCurrentUser from "@/hooks/useCurrentUser"

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
  const supabase = createClientComponentClient<Database>()
  const { toast } = useToast()
  const { group } = useUserGroup()
  const { currentUser } = useCurrentUser()

  useEffect(() => {
    const fetchGroupMembers = async () => {
      try {
        if (!currentUser || !group?.id) return

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

        // Transform the data to match the expected format
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
  }, [supabase, toast, currentUser,group])

  if (loading) {
    return <div className="flex justify-center p-4">Loading users...</div>
  }

  return (
    <div className="space-y-2">
      {members.length === 0 ? (
        <p className="text-center text-[#B4B7E5] py-4">No users found</p>
      ) : (
        members.map((member) => (
          <Card 
            key={member.user_id} 
            className="border-[#1F2137] bg-[#0D0F23]/50 backdrop-blur-sm"
          >
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
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}

export default UsersList
