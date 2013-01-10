<?php 
/*Dummy Example 1*/

class PressUpTest extends PHPUnit_Framework_TestCase {

  
  function testPass() {
  	
	$stack = array();
        $this->assertEquals(0, count($stack));
 
        array_push($stack, 'foo');
        $this->assertEquals('foo', $stack[count($stack)-1]);
        $this->assertEquals(1, count($stack));
 
        $this->assertEquals('foo', array_pop($stack));
        $this->assertEquals(0, count($stack));
  }
  
  function testFail() {
  	
        $this->assertEquals(0, 1, "Expecting this to fail since 1 != 0");
  }


}



?>