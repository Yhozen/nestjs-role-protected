# Nest role protected

## Usage

First define your roles and permissions

```typescript
import { RolesBuilder } from 'nestjs-role-protected'

export enum Roles {
  USER = 'USER',
  ADMIN = 'ADMIN',
  GUEST = 'GUEST',
}

const rolesPermissions = {
  [Roles.ADMIN]: {
    Order: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
  },
  [Roles.USER]: {
    Order: {
      'create:own': ['*'],
      'read:own': ['*'],
      'delete:own': ['*'],
      'update:own': ['*'],
    },
  },
}

export const roles = new RolesBuilder(rolesPermissions)
```

then add those roles to the app module

```typescript
import { Module } from '@nestjs/common'
import { AccessControlModule } from 'nestjs-role-protected'

import { roles } from './app.roles'

@Module({
  imports: [
    /* ... many modules ... */
    AccessControlModule.forRoles(roles),
  ],
  controllers: [
    /* your controllers /*]
  providers: [/* your providers */
  ],
})
export class AppModule {}
```

now, you can use the `RoleProtected` decorator to protect your resolver methods! 🔥

```typescript
/* ... imports ... */
import { RoleProtected } from 'nestjs-role-protected'

@Resolver(Order)
export class OrdersResolver {
  /* ... constructor and others methods ... */
  @RoleProtected({
    action: 'update',
  })
  @Mutation(() => Order)
  async updateOrder(
    @Args('id') id: string,
    @Args('input') input: OrderUpdate,
    @CurrentUser() user: User,
  ): Promise<Order> {
    return this.ordersService.update(id, user, input)
  }
}
```

ok but what about ownership? you'll need to check if user is owner of the document BUT if he has permission to update any then you don't need to check that

```typescript
/* ... imports ... */
import { RoleProtected, CanDoAny } from 'nestjs-role-protected'

@Resolver(Order)
export class OrdersResolver {
  /* ...constructor and others methods ... */
  @RoleProtected({
    action: 'update',
  })
  @Mutation(() => Order)
  async updateOrder(
    @Args('id') id: string,
    @Args('input') input: OrderUpdate,
    @CurrentUser() user: User,
    @CanDoAny() canDoAny: () => boolean,
  ): Promise<Order> {
    return this.ordersService.update(id, user, input, canDoAny())
  }
}
```

and now you can use different methods in your service depending on your permission
e.g.:

```typescript

  async update(
    id: string,
    user: User,
    item: OrderUpdate,
    canDoAny: boolean,
  ): Promise<Order> {
    if (canDoAny) return await this.orderModel.findByIdAndUpdate(id, item, { new: true })

    return await this.orderModel.findOneAndUpdate({ id, user: user.id }, item, {
      new: true,
    })
```
