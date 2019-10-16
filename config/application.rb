require_relative 'boot'
require "rails"
# Pick the frameworks you want:
require "active_model/railtie"
require "active_job/railtie"
require "active_record/railtie"
require "active_storage/engine"
require "action_controller/railtie"
require "action_mailer/railtie"
require "action_view/railtie"
require "action_cable/engine"
require "sprockets/railtie"
# require "sprockets/railtie"
# require "rails/test_unit/railtie"
require "stripe"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module ThnxApi
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 5.2

    config.active_job.queue_adapter = :sidekiq
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration can go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded after loading
    # the framework and any gems in your application.

    # Only loads a smaller set of middleware suitable for API only apps.
    # Middleware like session, flash, cookies can be added back manually.
    # Skip views, helpers and assets when generating a new resource.
    config.api_only = true

    #TODO read stripe key from secret
    Stripe.api_key = Rails.application.credentials.stripe_key if Rails.env.production?
    Stripe.api_key = Rails.application.credentials.test_stripe_key unless Rails.env.production?

    config.autoload_paths += %W(#{config.root}/lib)
    config.eager_load_paths << "#{config.root}/lib"

    # Sets the Headers for Microsoft Teams App
    config.action_dispatch.default_headers['X-Frame-Options'] = 'ALLOW-FROM https://teams.microsoft.com'
    config.action_dispatch.default_headers['Content-Security-Policy'] = 'frame-ancestors teams.microsoft.com *.teams.microsoft.com *.skype.com'
    
  end
end
