FROM registry.gosuslugi.local/base_images/nginx:1.13.10-1_centos-7.5

COPY --from=build --chown=1000:1000 sf-portal-st html/sf-portal-st
