# Restock Web Application

`restock-web-application` is the Web Application for the Restock platform.

This application serves as the main interface for users to interact with the Restock platform. It provides features for managing inventory, tracking devices and analyzing data collected from smart devices.

## Purpose

In the current version, the application focuses on:

- managing inventory resources (custom supplies, branches and batches)
- displaying real-time tracking information for devices
- displaying metrics and insights from telemetry data
- managing user profiles and subscriptions
- managing sales activities
- managing device registration and authentication
- managing user identities and roles
- managing planning processes
- managing communication notifications

## Bounded Contexts

### Analytics

The Analytics bounded context is responsible for processing and analyzing telemetry data. It provides insights and reports based on the collected data.

Main responsibility:

- process and analyze telemetry data
- generate reports and insights

Main domain concept:

- `Metric`

### Communications

The Communications bounded context is responsible for managing communication of events and notifications. It handles the delivery of messages to users or other systems based on certain triggers.

Main responsibility:

- send notifications and alerts
- manage communication channels

Main domain concept:

- `Notification`

### Devices

The Devices bounded context is responsible for managing the lifecycle of IoT devices, including their registration, authentication and configuration.

Main responsibility:

- manage device registration and authentication
- configure device settings

Main domain concept:

- `Device`

### IAM

The IAM bounded context is responsible for managing user identities, roles and permissions. It ensures that only authorized users can access certain features or data within the application.

Main responsibility:

- authenticate users and manage user sessions
- manage user roles and permissions

Main domain concept:

- `User`

### Planning

The Planning bounded context is responsible for managing the inventory planning process, including the making of recipes and kits.

Main responsibility:

- create and manage inventory recipes and kits

Main domain concept:

- `Recipe`
- `Kit`

### Profiles

The Profiles bounded context is responsible for managing user profiles, including personal information and preferences.

Main responsibility:

- store user preferences and settings
- manage business information

Main domain concept:

- `Profile`

### Resources

The Resources bounded context is responsible for managing the inventory resources, including custom supplies, branches and batches.

Main responsibility:

- create and manage resources for each business unit (branches).
- manage the stock of each resource.

Main domain concept:

- `Custom Supply`
- `Branch
- `Batch`

### Sales

The Sales bounded context is responsible for managing sales activities, including invoices, quotations and orders.

Main responsibility:

- create and manage sales orders
- manage the status of sales activities

Main domain concept:

- `Sales Order`

### Subscriptions

The Subscriptions bounded context is responsible for managing subscriptions for different plans in the application.

Main responsibility:

- manage user subscriptions
- provide access to premium features

Main domain concept:

- `Account`
- `Subscription`

### Tracking

The Tracking bounded context is responsible for displaying real-time tracking information for devices.

Main responsibility:

- it displays real-time tracking information

Main domain concept:

- `Conciliation Task`
- `Discrepancy`
- `Telemetry Reading`

## Architecture

Each bounded context follows a layered structure inspired by DDD principles.

### Domain Layer

Contains the core business concepts and rules of the bounded context.

Responsibilities:

- define entities
- enforce domain rules

### Application Layer

Coordinates use cases and application-specific workflows.

Responsibilities:

- orchestrate domain entities and calls to infrastructure layers
- handle application-level operations
- expose use cases to the presentation layer

### Infrastructure Layer

Contains technical implementations required by the application.

Responsibilities:

- define structured calls to external services (like apis)
- implement the usage of apis.

### Presentation Layer (Interfaces)

Exposes the views and sections of the application to the users.

Responsibilities:

- invoke application services for data retrieval
- present data to the user interface
- handle user interactions
- coordinate with the domain layer


## Project Structure

```text
restock-web-application/
├── package.json
├── package-lock.json
├── README.md
├── .gitignore
├── proxy.conf.json
├── .prettierrc
├── pnpm-lock.yaml
├── LICENSE.md
├── docs/
│   ├── class-diagram.puml
│   └── user-stories.md
├── public/
│   ├── assets/
│   ├── i18n/
│   └── favicon.ico
└── src/
    ├── app/
    │   ├── analytics/
    │   │   ├── application/
    │   │   ├── domain/
    │   │   ├── infrastructure/
    │   │   └── presentation/
    │   ├── communications/
    │   │   ├── application/
    │   │   ├── domain/
    │   │   ├── infrastructure/
    │   │   └── presentation/ 
    │   ├── devices/
    │   │   ├── application/
    │   │   ├── domain/
    │   │   ├── infrastructure/
    │   │   └── presentation/
    │   ├── iam/
    │   │   ├── application/
    │   │   ├── domain/
    │   │   ├── infrastructure/
    │   │   └── presentation/
    │   ├── planning/
    │   │   ├── application/
    │   │   ├── domain/
    │   │   ├── infrastructure/
    │   │   └── presentation/
    │   ├── profiles/
    │   │   ├── application/
    │   │   ├── domain/
    │   │   ├── infrastructure/
    │   │   └── presentation/
    │   ├── resource/
    │   │   ├── application/
    │   │   ├── domain/
    │   │   ├── infrastructure/
    │   │   └── presentation/
    │   ├── sales/
    │   │   ├── application/
    │   │   ├── domain/
    │   │   ├── infrastructure/
    │   │   └── presentation/
    │   ├── subscriptions/
    │   │   ├── application/
    │   │   ├── domain/
    │   │   ├── infrastructure/
    │   │   └── presentation/
    │   ├── tracking/
    │   │   ├── application/
    │   │   ├── domain/
    │   │   ├── infrastructure/
    │   │   └── presentation/
    │   ├── shared/
    │   │   ├── domain/
    │   │   ├── infrastructure/
    │   │   └── presentation/
    │   ├── app.config.ts
    │   ├── app.css
    │   ├── app.html
    │   ├── app.routes.ts
    │   ├── app.spec.ts
    │   └── app.ts
    ├── environments/
    │   ├── environment.development.ts
    │   └── environment.example.ts 
    ├── index.html
    ├── main.ts
    ├── material-theme.scss
    └── styles.css
```

## Technology Stack

The Web Application is built using the following technologies:

- TypeScript
- Angular 20
- PNPM
- SCSS
- Material Design
