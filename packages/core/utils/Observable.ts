/*Observable类是Observable模式的一个简单实现。
＊
*有一个细微的特殊性:一个给定的Observable可以使用一个特定的掩码值通知它的观察者，只有注册了这个掩码值的观察者才会被通知。
*这可以实现更细粒度的执行，而不必依赖于多个不同的Observable对象。
*例如，你可能有一个给定的Observable，它有四种不同类型的通知:Move (mask = 0x01)， Stop (mask = 0x02)， Turn Right (mask = 0X04)， Turn Left (mask = 0X08)。
*给定的观察者只能注册自己的移动和停止(掩码= 0x03)，然后它只会被通知当这两个发生之一，永远不会左转/右转
*/
