json.data do
  json.partial! 'groups/group', collection: @groups.data, :as => :group
end if @groups
json.meta @groups.fetch(:meta) if @groups