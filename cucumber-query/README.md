# Cucumber Query

This is a query API for [cucumber-messsages](../cucumber-messages).

## Overview

The different message types in `cucumber-messages` have references to each other
using `id` fields. It's a bit similar to rows in a relational database, with
primary and foreign keys.

Consumers of these messages may want to *query* the messages for certain information.
For example, [cucumber-react]() needs to know the status of a [Step](../cucumber-messages/messages.md#io.cucumber.messages.GherkinDocument.Feature.Step) as it
is rendering the [GherkinDocument](../cucumber-messages/messages.md#io.cucumber.messages.GherkinDocument)

The `cucumber-query` library makes this easy by providing a function to look up the
status of a step, a scenario or an entire file.