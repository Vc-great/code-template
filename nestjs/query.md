## array
```ts
//https://docs.nestjs.com/techniques/validation#parsing-and-validating-arrays
@Get()
findByIds(
    @Query('ids', new ParseArrayPipe({ items: Number, separator: ',' }))
ids: number[],
) {
    return 'This action returns users by ids';
}

//GET /?ids=1,2,3

```
