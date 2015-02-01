json.id comment[:id]
json.title comment[:title] if comment[:title]
json.comment comment[:comment] if comment[:comment]
json.commentable_type comment[:commentable_type] if comment[:commentable_type]
json.commentable_id comment[:commentable_id] if comment[:commentable_id]
json.user_id comment[:user_id] if comment[:user_id]
json.created_at comment[:created_at] if comment[:created_at]
#json.updated_at comment[:updated_at] if comment[:updated_at]
json.user do
  json.partial! 'users/base', user: comment[:user]
end if comment[:user]