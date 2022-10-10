apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: {{ component_name }}
allowVolumeExpansion: true
parameters:
  skuname: StandardSSD_LRS
provisioner: disk.csi.azure.com
reclaimPolicy: Delete
