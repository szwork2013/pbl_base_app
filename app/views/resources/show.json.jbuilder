json.data do
  json.extract! @resource, :id, :name, :owner_id, :owner_type, :size, :ext, :mime_type, :md5, :key, :exif, :image_info, :image_ave, :persistent_id, :avinfo
end