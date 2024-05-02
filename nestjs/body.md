## body
```ts
//https://docs.nestjs.com/techniques/validation#parsing-and-validating-arrays
@Post()
createBulk(
  @Body(new ParseArrayPipe({ items: CreateUserDto }))
  createUserDtos: CreateUserDto[],
) {
  return 'This action adds new users';
}
```
