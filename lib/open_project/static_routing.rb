#-- copyright
# OpenProject is a project management system.
# Copyright (C) 2012-2018 the OpenProject Foundation (OPF)
#
# This program is free software; you can redistribute it and/or
# modify it under the terms of the GNU General Public License version 3.
#
# OpenProject is a fork of ChiliProject, which is a fork of Redmine. The copyright follows:
# Copyright (C) 2006-2017 Jean-Philippe Lang
# Copyright (C) 2010-2013 the ChiliProject Team
#
# This program is free software; you can redistribute it and/or
# modify it under the terms of the GNU General Public License
# as published by the Free Software Foundation; either version 2
# of the License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
#
# See docs/COPYRIGHT.rdoc for more details.
#++

module OpenProject
  module StaticRouting
    ##
    # Makes URL helpers accessible outside the view or controller context.
    # It's called static routing url helpers as it does not use request information.
    # For instance it does not read the host from the request but instead
    # it takes the host from the Settings. This may or may not work completely.
    #
    # Most importantly it does work for the '#{model}_path|url' helpers, though.
    module UrlHelpers
      extend ActiveSupport::Concern
      include Rails.application.routes.url_helpers

      included do
        def default_url_options
          options = ActionMailer::Base.default_url_options.clone

          reverse_merge = lambda { |opt, value|
            unless options[opt] || value.blank?
              options[opt] = value
            end
          }

          reverse_merge.call :script_name, OpenProject::Configuration.rails_relative_url_root
          reverse_merge.call :host,        OpenProject::StaticRouting::UrlHelpers.host
          reverse_merge.call :protocol,    Setting.protocol

          options
        end
      end

      def self.host
        host = Setting.host_name
        host.gsub(/\/.*$/, '') if host # remove path in case it got into the host
      end
    end

    class StaticRouter
      def url_helpers
        @url_helpers ||= StaticUrlHelpers.new
      end
    end

    class StaticUrlHelpers
      include StaticRouting::UrlHelpers
    end


    ##
    # Try to recognize a route entry for the given path
    # but strips the relative URL root information away beforehand.
    #
    # Returns nil if it could not be processed.
    def self.recognize_route(path)
      return nil unless path.present?

      # Remove relative URL root
      if relative_url = OpenProject::Configuration.rails_relative_url_root
        path = path.gsub relative_url, ''
      end

      Rails.application.routes.recognize_path(path)
    rescue ActionController::RoutingError
      nil
    end
  end
end
