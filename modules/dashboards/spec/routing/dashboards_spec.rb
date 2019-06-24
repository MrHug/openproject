require 'spec_helper'

describe Dashboards::DashboardsController, type: :routing do
  it {
    expect(get('/projects/project_42/dashboards')).to route_to(controller: 'dashboards/dashboards',
                                                               action: 'show',
                                                               project_id: 'project_42')
  }
end
