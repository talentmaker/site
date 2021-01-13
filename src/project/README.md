# Project

Project displays a single project.

This component belongs to the route `/project/:id`, where `id` is the project id.
This component also belongs to the route `/project`, where a query is required for the competition id. The project is then fetched based on the current user and the competition id, since only one project can be made per competition.

Because this component is large, some methods have to be moved to a sub class. `BaseComponent` defines lifecycle methods for this component, as well as its constructor.
