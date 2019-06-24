# Prevent load-order problems in case openproject-plugins is listed after a plugin in the Gemfile
# or not at all
require 'open_project/plugins'

#require 'redmine/menu_manager'
#require 'open_project/access_control'

module Dashboards
  class Engine < ::Rails::Engine
    isolate_namespace Dashboards

    engine_name :dashboards

    include OpenProject::Plugins::ActsAsOpEngine

    initializer 'dashboards.menu' do
      ::Redmine::MenuManager.map(:project_menu) do |menu|
        menu.push(:dashboards,
                  { controller: 'dashboards/dashboards', action: 'show' },
                  caption: :'dashboards.label',
                  after: :work_packages,
                  before: :calendar,
                  param: :project_id,
                  engine: :dashboards,
                  icon: 'icon2')
      end
    end

    initializer 'dashboards.menu' do
      OpenProject::AccessControl.map do |map|
        map.project_module(:dashboards) do |map|
          map.permission(:view_dashboards, { 'dashboards/dashboards': ['show'] })
        end
      end
    end
  end
end
